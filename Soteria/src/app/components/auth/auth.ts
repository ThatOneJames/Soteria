import { Component, NgModule, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, CanActivateFn, Router, RouterLink, RouterModule } from '@angular/router';
import { Observable, of, delay, throwError, BehaviorSubject, tap } from 'rxjs';

type AuthTab = 'login' | 'signup';
type UserRole = 'admin' | 'user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// ---------------------------------------------------------------------
// Service layer — only this changes when the backend exists. Swap the
// of(...) mocks for HttpClient calls (e.g. this.http.post<AuthResult>
// ('/api/auth/login', payload)); AuthComponent stays untouched.
// ---------------------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class AuthService {
  private mockUsers: { firstName: string; lastName: string; email: string; password: string; role: UserRole }[] = [
    { firstName: 'Demo', lastName: 'User', email: 'demo@soteria.ph', password: 'password123', role: 'user' },
    { firstName: 'Admin', lastName: 'Account', email: 'admin@soteria.ph', password: 'admin123', role: 'admin' },
  ];

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.readStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  private readStoredUser(): UserProfile | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('soteria_user');
    return raw ? JSON.parse(raw) : null;
  }

  login(payload: LoginPayload): Observable<AuthResult> {
    const match = this.mockUsers.find(
      u => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password
    );
    if (!match) {
      return throwError(() => new Error('Incorrect email or password.')).pipe(delay(500));
    }
    const user: UserProfile = {
      firstName: match.firstName,
      lastName: match.lastName,
      email: match.email,
      role: match.role,
    };
    return of({ success: true, message: 'Logged in successfully.', token: 'mock-token-123' }).pipe(
      delay(500),
      tap(() => {
        this.currentUserSubject.next(user);
        localStorage.setItem('soteria_user', JSON.stringify(user));
      })
    );
  }

  register(payload: SignupPayload): Observable<AuthResult> {
    const exists = this.mockUsers.some(u => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      return throwError(() => new Error('An account with this email already exists.')).pipe(delay(500));
    }
    this.mockUsers.push({ ...payload, role: 'user' });
    return of({ success: true, message: 'Account created successfully.', token: 'mock-token-456' }).pipe(delay(500));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('soteria_user');
  }
}

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
})
export class AuthComponent {
  activeTab: AuthTab = 'login';
  submitting = false;
  errorMessage = '';
  successMessage = '';

  loginForm = { email: '', password: '', remember: false };

  signupForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    if (this.authService.currentUser) {
      const destination = this.authService.currentUser.role === 'admin' ? '/admin' : '/';
      this.router.navigate([destination]);
      return;
    }

    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'signup') {
      this.activeTab = 'signup';
    }
  }

  setTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  get signupPasswordsMismatch(): boolean {
    return (
      this.signupForm.confirmPassword.length > 0 &&
      this.signupForm.password !== this.signupForm.confirmPassword
    );
  }

  get signupPasswordTooShort(): boolean {
    return this.signupForm.password.length > 0 && this.signupForm.password.length < 8;
  }

  onLoginSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.submitting = true;
    this.authService.login(this.loginForm).subscribe({
      next: result => {
        this.submitting = false;
        this.successMessage = result.message;
        const destination = this.authService.currentUser?.role === 'admin' ? '/admin' : '/';
        setTimeout(() => this.router.navigate([destination]), 600);
      },
      error: (err: Error) => {
        this.submitting = false;
        this.errorMessage = err.message;
      },
    });
  }

  onSignupSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.signupForm.firstName ||
      !this.signupForm.lastName ||
      !this.signupForm.email ||
      !this.signupForm.password ||
      !this.signupForm.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.signupPasswordTooShort) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    if (this.signupPasswordsMismatch) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.submitting = true;
    const { firstName, lastName, email, password } = this.signupForm;
    this.authService.register({ firstName, lastName, email, password }).subscribe({
      next: result => {
        this.submitting = false;
        this.successMessage = result.message + ' You can now log in.';
        this.setTab('login');
        this.loginForm.email = email;
      },
      error: (err: Error) => {
        this.submitting = false;
        this.errorMessage = err.message;
      },
    });
  }
}

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser?.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [AuthComponent],
})
export class AuthModule {}
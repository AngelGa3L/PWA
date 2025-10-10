export class AuthService {
async login(username: string, password: string): Promise<string> {
    // Implement your authentication logic here
    // For example, verify username and password against the database
    if (username === 'admin' && password === 'password') {
      // Generate and return a JWT token or session identifier
      return 'mock-jwt-token';
    } else {
      throw new Error('Invalid username or password');
    }
  }
}
export default new AuthService();
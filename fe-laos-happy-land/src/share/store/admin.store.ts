// Simple admin store without external dependencies
interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AdminState {
  sidebarOpen: boolean;
  currentUser: User | null;
}

class AdminStore {
  private state: AdminState = {
    sidebarOpen: false,
    currentUser: {
      name: 'Admin User',
      email: 'admin@laoshappyland.com',
      role: 'Super Admin',
    },
  };

  private listeners: Array<() => void> = [];

  getSidebarOpen() {
    return this.state.sidebarOpen;
  }

  setSidebarOpen(open: boolean) {
    this.state.sidebarOpen = open;
    this.notifyListeners();
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  setCurrentUser(user: User) {
    this.state.currentUser = user;
    this.notifyListeners();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const adminStore = new AdminStore();

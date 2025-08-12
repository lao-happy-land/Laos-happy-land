export enum OrderSort {
    ASC = 'ASC',
    DESC = 'DESC',
  }
  
export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
  AGENT = 'agent'
}

export enum OrderEnum {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export enum ActionEnum {
  APPROVE_ACCOUNT = 'approve_account',
  CONFIRM_PAYMENT = 'confirm_payment',
  GENERATE_REPORT = 'generate_report'
}

export enum CtvOrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
}
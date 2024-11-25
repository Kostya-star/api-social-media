export interface IEmailConfirmationBody {
  code: string | null;
  expDate: Date | null;
  isConfirmed: boolean;
}

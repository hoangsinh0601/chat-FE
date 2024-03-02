import { ErrorCode } from '@constants/enums';

export interface IApplicationError {
  code: ErrorCode;
  message: string;
}

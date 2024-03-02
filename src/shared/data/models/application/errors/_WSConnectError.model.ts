import { IApplicationError } from '@interfaces/application/errors';
import { ErrorCode } from '@constants/enums';

export class WSConnectError extends Error implements IApplicationError {
  code: ErrorCode;
  override message: string;

  constructor(message?: string) {
    super();

    this.code = ErrorCode.WS_CONNECTION_ERROR;
    this.message = message ?? 'Unable to connect to remote socket server!';
  }
}

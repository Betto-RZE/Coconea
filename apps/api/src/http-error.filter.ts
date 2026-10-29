import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const payload =
      exception instanceof HttpException ? exception.getResponse() : null;
    const details =
      typeof payload === "object" && payload !== null
        ? (payload as Record<string, unknown>)
        : {};
    const codes: Record<number, string> = {
      400: "VALIDATION_ERROR",
      401: "AUTHENTICATION_REQUIRED",
      403: "ACCESS_DENIED",
      404: "NOT_FOUND",
      409: "VERSION_CONFLICT",
      413: "PAYLOAD_TOO_LARGE",
    };
    response
      .status(status)
      .json({
        error: {
          code: details.code || codes[status] || "INTERNAL_ERROR",
          message:
            status === 500
              ? "No se pudo completar la operación."
              : details.message || payload || "Solicitud rechazada.",
          ...(details.details ? { details: details.details } : {}),
        },
      });
  }
}

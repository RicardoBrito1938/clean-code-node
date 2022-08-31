import { ServerError } from "./../errors/server-error";
import { EmailValidator } from "./../protocols/email-validator";
import { Controller } from "./../protocols/controller";
import { badRequest } from "./../helpers/http-helper";
import { MissingParamError } from "../errors/missing-param-errors";
import { HttpRequest, HttpResponse } from "./../protocols/http";
import { InvalidParamError } from "../errors/invalid-param-errors.";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation"
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) return badRequest(new InvalidParamError("email"));
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
}

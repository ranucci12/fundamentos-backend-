import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodvalidationPipe implements PipeTransform{
    constructor(private schema:  ZodSchema){}

    transform(value: unknown) {
        try {
            return this.schema.parse(value);
        }catch (error) {
            if (error instanceof ZodError)
            throw new BadRequestException({
                message: 'validation failed',
                statusCode: 400,
                errors: fromZodError(error),
            });
        }
        return value;
    }
}
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { z } from 'nestjs-zod/z'
import { ZodValidationException } from 'nestjs-zod'

@Injectable()
export class UserOwnsCollection implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    const parsedUserId = z.number().safeParse(Number(request.user.id))
    const parsedCollectionId = z
      .number()
      .safeParse(Number(request.params.collectionId))

    if (!parsedUserId.success)
      throw new ZodValidationException(parsedUserId.error)
    if (!parsedCollectionId.success)
      throw new ZodValidationException(parsedCollectionId.error)

    return this.authService.isUserOwnCollection(
      parsedUserId.data,
      parsedCollectionId.data,
    )
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { AuthService } from 'src/auth/auth.service'
import { z } from 'nestjs-zod/z'

@Injectable()
export class UserOwnsResource implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const parsedUserId = z.number().safeParse(request.user.id)
    const parsedCollectionId = z
      .number()
      .safeParse(Number(request.params.collectionId))

    // im not sure if I should validate here but better safe than sorry
    if (!parsedUserId.success || !parsedCollectionId.success) return false

    return this.authService.isUserOwnCollection(
      parsedUserId.data,
      parsedCollectionId.data,
    )
  }
}

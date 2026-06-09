import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() decorator
 * Extracts the authenticated user from the request object.
 * Use with @UseGuards(JwtAuthGuard)
 *
 * Example:
 *   @Get('me')
 *   @UseGuards(JwtAuthGuard)
 *   getMe(@CurrentUser() user: any) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

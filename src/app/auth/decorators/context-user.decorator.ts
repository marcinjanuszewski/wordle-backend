import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getUserFromContext = (context: ExecutionContext): unknown => {
  return context.switchToHttp().getRequest().user;
};

const ContextUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  return getUserFromContext(ctx);
});

export default ContextUser;

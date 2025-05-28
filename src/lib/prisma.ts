import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: ReturnType<typeof prismaWithExtensions> | undefined;
}

const prismaWithExtensions = () => {
  return new PrismaClient().$extends(withAccelerate());
};

let prisma: ReturnType<typeof prismaWithExtensions>;

if (process.env.NODE_ENV === 'production') {
  prisma = prismaWithExtensions();
} else {
  if (!global.prisma) {
    global.prisma = prismaWithExtensions();
  }
  prisma = global.prisma;
}

export default prisma;









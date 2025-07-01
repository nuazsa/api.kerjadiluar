import prisma from '../config/db';

export const getUsers = async (filters: { roleId?: string; name?: string }) => {
  const { roleId, name } = filters;

  return prisma.user.findMany({
    where: {
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(roleId && {
        roles: {
          some: {
            role_id: roleId,
          },
        },
      }),
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
};


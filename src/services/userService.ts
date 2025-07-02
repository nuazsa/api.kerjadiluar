import prisma from '../config/db';

const userPublicData = {
  id: true,
  name: true,
  email: true,
  created_at: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

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
    select: userPublicData,
  });
};

interface UserUpdatePayload {
  name?: string;
  email?: string;
}

export const updateUser = async (id: string, data: UserUpdatePayload) => {
  return prisma.user.update({
    where: {
      id: id,
    },
    data: data,
    select: userPublicData,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: {
      id: id,
    },
    select: userPublicData,
  });
};
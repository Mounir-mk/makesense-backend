const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const updateDecisions = async () => {
  console.warn("Checking decisions status");
  try {
    const decisionsWithOnlyStatus = await prisma.decision.findMany({
      select: {
        id: true,
        deadline: true,
        status: true,
      },
    });
    Promise.all(
      decisionsWithOnlyStatus.map(async (decision) => {
        if (
          decision.status === "in_progress" &&
          decision.deadline < new Date()
        ) {
          try {
            await prisma.decision.update({
              where: {
                id: decision.id,
              },
              data: {
                status: "finished",
              },
            });
            return null;
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return decision;
        }
      })
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  updateDecisions,
};

import type { Prisma, User, Session, Container } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "Session" | "Containers";
        ListRelations: "Session" | "Containers";
        Relations: {
            Session: {
                Shape: Session[];
                Types: PrismaTypes["Session"];
            };
            Containers: {
                Shape: Container[];
                Types: PrismaTypes["Container"];
            };
        };
    };
    Session: {
        Shape: Session;
        Include: Prisma.SessionInclude;
        Where: Prisma.SessionWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
    Container: {
        Shape: Container;
        Include: Prisma.ContainerInclude;
        Where: Prisma.ContainerWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User | null;
                Types: PrismaTypes["User"];
            };
        };
    };
}
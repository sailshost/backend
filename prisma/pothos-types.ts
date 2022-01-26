import type { Prisma, User, PasswordReset, Session, Container, Team, Membership } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "Teams" | "Session" | "Containers" | "PasswordReset";
        ListRelations: "Teams" | "Session" | "Containers" | "PasswordReset";
        Relations: {
            Teams: {
                Shape: Membership[];
                Types: PrismaTypes["Membership"];
            };
            Session: {
                Shape: Session[];
                Types: PrismaTypes["Session"];
            };
            Containers: {
                Shape: Container[];
                Types: PrismaTypes["Container"];
            };
            PasswordReset: {
                Shape: PasswordReset[];
                Types: PrismaTypes["PasswordReset"];
            };
        };
    };
    PasswordReset: {
        Shape: PasswordReset;
        Include: Prisma.PasswordResetInclude;
        Where: Prisma.PasswordResetWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User | null;
                Types: PrismaTypes["User"];
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
                Shape: User | null;
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
    Team: {
        Shape: Team;
        Include: Prisma.TeamInclude;
        Where: Prisma.TeamWhereUniqueInput;
        Fields: "members";
        ListRelations: "members";
        Relations: {
            members: {
                Shape: Membership[];
                Types: PrismaTypes["Membership"];
            };
        };
    };
    Membership: {
        Shape: Membership;
        Include: Prisma.MembershipInclude;
        Where: Prisma.MembershipWhereUniqueInput;
        Fields: "team" | "user";
        ListRelations: never;
        Relations: {
            team: {
                Shape: Team;
                Types: PrismaTypes["Team"];
            };
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
}
import type { Prisma, User, PasswordReset, Session, Container, Team, Membership, TeamReferral, OtpCodes } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Shape: User;
        Include: Prisma.UserInclude;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "Teams" | "Session" | "Containers" | "PasswordReset" | "TeamReferral" | "OtpCodes";
        ListRelations: "Teams" | "Session" | "Containers" | "PasswordReset" | "TeamReferral" | "OtpCodes";
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
            TeamReferral: {
                Shape: TeamReferral[];
                Types: PrismaTypes["TeamReferral"];
            };
            OtpCodes: {
                Shape: OtpCodes[];
                Types: PrismaTypes["OtpCodes"];
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
        Fields: "referrals" | "members";
        ListRelations: "referrals" | "members";
        Relations: {
            referrals: {
                Shape: TeamReferral[];
                Types: PrismaTypes["TeamReferral"];
            };
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
    TeamReferral: {
        Shape: TeamReferral;
        Include: Prisma.TeamReferralInclude;
        Where: Prisma.TeamReferralWhereUniqueInput;
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
    OtpCodes: {
        Shape: OtpCodes;
        Include: Prisma.OtpCodesInclude;
        Where: Prisma.OtpCodesWhereUniqueInput;
        Fields: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
}
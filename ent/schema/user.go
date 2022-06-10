
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// User holds the schema definition for the User entity.
type User struct {
    ent.Schema
}

// Fields of User.
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.String("firstName").Optional(),
        field.String("lastName").Optional(),
        field.String("username"),
        field.String("avatar").Optional().Default("https://avatar.tobi.sh/sails.jpg"),
        field.Time("createdAt"),
        field.Time("updatedAt"),
        field.String("email"),
        field.String("code").Optional(),
        field.String("token").Optional(),
        field.String("password"),
        field.Bool("emailedCompleted").Default(false),
        field.Enum("userType").Values("NORMAL","STAFF","ADMIN").Default("NORMAL"),
        field.String("otpSecret").Optional(),
        field.String("otpOnboard").Optional(),
        field.String("otpBackup"),
        field.Enum("otpType").Values("EMAIL","GEN").Optional(),
        field.Enum("UserPlan").Values("NORMAL","PRO").Default("NORMAL"),
    }
}

// Edges of User.
func (User) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("Teams", Membership.Type),
        edge.To("Session", Session.Type),
        edge.To("Containers", Container.Type),
        edge.To("PasswordReset", PasswordReset.Type),
        edge.To("TeamReferral", TeamReferral.Type),
        edge.To("OtpCodes", OtpCodes.Type),
    }
}

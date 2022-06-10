
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// TeamReferral holds the schema definition for the TeamReferral entity.
type TeamReferral struct {
    ent.Schema
}

// Fields of TeamReferral.
func (TeamReferral) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.String("teamId"),
        field.String("userId"),
        field.Bool("used").Default(false),
        field.Time("createdAt"),
        field.Time("expiresAt").Optional(),
        field.Enum("role").Values("OWNER","ADMIN","EDITOR","MEMBER"),
    }
}

// Edges of TeamReferral.
func (TeamReferral) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("team", Team.Type),
        edge.To("user", User.Type),
    }
}

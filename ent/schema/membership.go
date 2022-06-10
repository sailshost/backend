
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// Membership holds the schema definition for the Membership entity.
type Membership struct {
    ent.Schema
}

// Fields of Membership.
func (Membership) Fields() []ent.Field {
    return []ent.Field{
        field.String("teamId"),
        field.String("userId"),
        field.Bool("accepted").Default(false),
        field.Enum("role").Values("OWNER","ADMIN","EDITOR","MEMBER"),
    }
}

// Edges of Membership.
func (Membership) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("team", Team.Type),
        edge.To("user", User.Type),
    }
}

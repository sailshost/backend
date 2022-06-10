
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// Team holds the schema definition for the Team entity.
type Team struct {
    ent.Schema
}

// Fields of Team.
func (Team) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.String("name").Optional(),
        field.String("slug").Optional(),
        field.String("logo").Optional(),
    }
}

// Edges of Team.
func (Team) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("referrals", TeamReferral.Type),
        edge.To("members", Membership.Type),
    }
}

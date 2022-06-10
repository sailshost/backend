
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// Container holds the schema definition for the Container entity.
type Container struct {
    ent.Schema
}

// Fields of Container.
func (Container) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.Time("createdAt"),
        field.Time("updatedAt"),
        field.String("userId"),
        field.String("origin"),
        field.String("uuid"),
        field.String("snapshot").Optional(),
        field.String("logo").Optional(),
    }
}

// Edges of Container.
func (Container) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("user", User.Type),
    }
}

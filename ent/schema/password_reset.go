
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// PasswordReset holds the schema definition for the PasswordReset entity.
type PasswordReset struct {
    ent.Schema
}

// Fields of PasswordReset.
func (PasswordReset) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.Time("createdAt"),
        field.Time("updatedAt"),
        field.Time("expiresAt").Optional(),
        field.Bool("used").Default(false),
        field.String("userId"),
    }
}

// Edges of PasswordReset.
func (PasswordReset) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("user", User.Type),
    }
}

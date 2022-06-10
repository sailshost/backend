
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// OtpCodes holds the schema definition for the OtpCodes entity.
type OtpCodes struct {
    ent.Schema
}

// Fields of OtpCodes.
func (OtpCodes) Fields() []ent.Field {
    return []ent.Field{
        field.String("code"),
        field.String("userId"),
        field.Bool("used").Default(false),
        field.Time("createdAt"),
    }
}

// Edges of OtpCodes.
func (OtpCodes) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("user", User.Type),
    }
}

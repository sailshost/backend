
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field" 
	"entgo.io/ent/schema/edge"
)

// Session holds the schema definition for the Session entity.
type Session struct {
    ent.Schema
}

// Fields of Session.
func (Session) Fields() []ent.Field {
    return []ent.Field{
        field.String("id"),
        field.Time("createdAt"),
        field.Time("updatedAt"),
        field.String("userId"),
        field.String("ip"),
        field.String("lastIp").Optional(),
        field.String("userAgent"),
        field.Time("expiresAt").Optional(),
        field.Enum("type").Values("FULL","OTP").Optional(),
    }
}

// Edges of Session.
func (Session) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("user", User.Type),
    }
}

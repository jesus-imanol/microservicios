package entities

import (
	"time"
)

type PostCouple struct {
	IDPost         int64     `json:"id"` // Clave Primaria (PK)
	Titulo         string    `json:"titulo"`
	Contenido      string    `json:"contenido"`
	NombreAnonimo  string    `json:"nombre_anonimo"` // El alias que elige el autor
	FechaPublicacion time.Time `json:"fecha_publicacion"`
	// --- Atributos de Clasificación y Medios ---
	Categoria      string    `json:"categoria"`
	// Se puede usar un tipo string para las etiquetas, serializando y deserializando un array de strings (ej: con JSONB en PostgreSQL).
	Etiquetas      []string  `json:"etiquetas"`	
	// --- Atributos de Interacción (Contadores) ---
	NumMeGusta     int64     `json:"num_me_gusta"`     
}

func NewPostCouple(titulo, contenido, nombreAnonimo, categoria string, etiquetas []string) *PostCouple {
	return &PostCouple{
		Titulo:          titulo,
		Contenido:       contenido,
		NombreAnonimo:   nombreAnonimo,
		FechaPublicacion: time.Now(),
		Categoria:       categoria,
		Etiquetas:       etiquetas,
		NumMeGusta:      0,
	}
}
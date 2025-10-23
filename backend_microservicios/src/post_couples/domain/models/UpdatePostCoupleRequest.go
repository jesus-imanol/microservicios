package models

type UpdatePostCoupleRequest struct {
	Titulo    string   `json:"titulo"`
	Contenido string   `json:"contenido"`
	Categoria string   `json:"categoria"`
	Etiquetas []string `json:"etiquetas"`
}

package models

type CreatePostCoupleRequest struct {
    Titulo        string   `json:"titulo" binding:"required"`
    Contenido     string   `json:"contenido" binding:"required"`
    NombreAnonimo string   `json:"nombre_anonimo" binding:"required"`
    Categoria     string   `json:"categoria" binding:"required"`
    Etiquetas     []string `json:"etiquetas"`
}
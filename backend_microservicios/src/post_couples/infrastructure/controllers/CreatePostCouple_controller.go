package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreatePostCouplesController struct {
	createPostUseCase *usecases.CreatePostCouples
}

func NewCreatePostCouplesController(createPostUseCase *usecases.CreatePostCouples) *CreatePostCouplesController {
	return &CreatePostCouplesController{
		createPostUseCase: createPostUseCase,
	}
}

func (cpc *CreatePostCouplesController) CreatePostCouple(g *gin.Context) {
	var req models.CreatePostCoupleRequest
	if err := g.ShouldBindJSON(&req); err != nil {
		g.JSON(http.StatusNotAcceptable, gin.H{"error": err.Error()})
		return
	}

	// Construir la entidad desde el request; NewPostCouple asigna FechaPublicacion = time.Now()
	post := entities.NewPostCouple(req.Titulo, req.Contenido, req.NombreAnonimo, req.Categoria, req.Etiquetas)

	if err := cpc.createPostUseCase.Execute(post); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"data": gin.H{
			"attributes": gin.H{
				"id_post":           post.IDPost,
				"titulo":            post.Titulo,
				"contenido":         post.Contenido,
				"nombre_anonimo":    post.NombreAnonimo,
				"fecha_publicacion": post.FechaPublicacion,
				"categoria":         post.Categoria,
				"etiquetas":         post.Etiquetas,
				"num_me_gusta":      post.NumMeGusta,
			},
		},
	}
	g.JSON(http.StatusCreated, response)
}

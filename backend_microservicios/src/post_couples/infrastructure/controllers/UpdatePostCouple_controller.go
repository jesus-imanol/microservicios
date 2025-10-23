package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UpdatePostCoupleController struct {
	updatePostUseCase *usecases.UpdatePostCouple
}

func NewUpdatePostCoupleController(updatePostUseCase *usecases.UpdatePostCouple) *UpdatePostCoupleController {
	return &UpdatePostCoupleController{
		updatePostUseCase: updatePostUseCase,
	}
}

func (upc *UpdatePostCoupleController) UpdatePostCouple(g *gin.Context) {
	// Obtener el ID del path parameter
	idStr := g.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	var req models.UpdatePostCoupleRequest
	if err := g.ShouldBindJSON(&req); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Construir la entidad con los datos actualizados
	post := &entities.PostCouple{
		IDPost:    id,
		Titulo:    req.Titulo,
		Contenido: req.Contenido,
		Categoria: req.Categoria,
		Etiquetas: req.Etiquetas,
	}

	if err := upc.updatePostUseCase.Execute(post); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"message": "Post actualizado exitosamente",
		"data": gin.H{
			"id_post":   post.IDPost,
			"titulo":    post.Titulo,
			"contenido": post.Contenido,
			"categoria": post.Categoria,
			"etiquetas": post.Etiquetas,
		},
	}
	g.JSON(http.StatusOK, response)
}

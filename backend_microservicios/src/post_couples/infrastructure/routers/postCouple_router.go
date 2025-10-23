package routers

import (
	"backend_microservicios/src/post_couples/infrastructure/controllers"

	"github.com/gin-gonic/gin"
)

func PostCoupleRoutes(
	r *gin.Engine,
	createPostCouple_controller *controllers.CreatePostCouplesController,
	getAllPosts_controller *controllers.GetAllPostsController,
	getPostsByTag_controller *controllers.GetPostsByTagController,
	updatePostCouple_controller *controllers.UpdatePostCoupleController,
	deletePostCouple_controller *controllers.DeletePostCoupleController,
	incrementLikes_controller *controllers.IncrementLikesController,
) {
	// Crear un post
	r.POST("/post_couples", createPostCouple_controller.CreatePostCouple)

	// Obtener todos los posts
	r.GET("/post_couples", getAllPosts_controller.GetAllPosts)

	// Obtener posts por etiqueta
	r.GET("/post_couples/tag/:tag", getPostsByTag_controller.GetPostsByTag)

	// Actualizar un post
	r.PUT("/post_couples/:id", updatePostCouple_controller.UpdatePostCouple)

	// Eliminar un post
	r.DELETE("/post_couples/:id", deletePostCouple_controller.DeletePostCouple)

	// Incrementar me gusta
	r.PATCH("/post_couples/:id/like", incrementLikes_controller.IncrementLikes)
}

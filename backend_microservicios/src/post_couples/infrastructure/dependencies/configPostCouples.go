package dependencies

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"backend_microservicios/src/post_couples/infrastructure/adapters"
	"backend_microservicios/src/post_couples/infrastructure/controllers"
	"backend_microservicios/src/post_couples/infrastructure/routers"

	"github.com/gin-gonic/gin"
)

func InitPostCouplesDependencies(ps *adapters.MySQL, r *gin.Engine) {
	// Inicializar casos de uso
	createPostCouple_usecase := usecases.NewCreatePostCouples(ps)
	getAllPosts_usecase := usecases.NewGetAllPosts(ps)
	getPostsByTag_usecase := usecases.NewGetPostsByTag(ps)
	updatePostCouple_usecase := usecases.NewUpdatePostCouple(ps)
	deletePostCouple_usecase := usecases.NewDeletePostCouple(ps)
	incrementLikes_usecase := usecases.NewIncrementLikesUseCase(ps)

	// Inicializar controladores
	createPostCouple_controller := controllers.NewCreatePostCouplesController(createPostCouple_usecase)
	getAllPosts_controller := controllers.NewGetAllPostsController(getAllPosts_usecase)
	getPostsByTag_controller := controllers.NewGetPostsByTagController(getPostsByTag_usecase)
	updatePostCouple_controller := controllers.NewUpdatePostCoupleController(updatePostCouple_usecase)
	deletePostCouple_controller := controllers.NewDeletePostCoupleController(deletePostCouple_usecase)
	incrementLikes_controller := controllers.NewIncrementLikesController(incrementLikes_usecase)

	// Configurar rutas
	routers.PostCoupleRoutes(r, createPostCouple_controller, getAllPosts_controller, getPostsByTag_controller, updatePostCouple_controller, deletePostCouple_controller, incrementLikes_controller)
}

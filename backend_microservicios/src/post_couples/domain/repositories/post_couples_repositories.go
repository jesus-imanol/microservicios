package repositories

import "backend_microservicios/src/post_couples/domain/entities"

type PostCouplesRepository interface {
	CreatePostCouples(postCouple *entities.PostCouple) error
	GetAllPostCouples() ([]*entities.PostCouple, error)
	GetPostCouplesByTag(tag string) ([]*entities.PostCouple, error)
	UpdatePostCouple(postCouple *entities.PostCouple) error
	DeletePostCouple(id int64) error
	IncrementLikes(id int64) error
}

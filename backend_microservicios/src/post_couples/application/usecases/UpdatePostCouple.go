package usecases

import (
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/repositories"
)

type UpdatePostCouple struct {
	repository repositories.PostCouplesRepository
}

func NewUpdatePostCouple(repository repositories.PostCouplesRepository) *UpdatePostCouple {
	return &UpdatePostCouple{
		repository: repository,
	}
}

func (u *UpdatePostCouple) Execute(post *entities.PostCouple) error {
	return u.repository.UpdatePostCouple(post)
}

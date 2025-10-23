package usecases

import (
	"backend_microservicios/src/post_couples/domain/repositories"
)

type DeletePostCouple struct {
	repository repositories.PostCouplesRepository
}

func NewDeletePostCouple(repository repositories.PostCouplesRepository) *DeletePostCouple {
	return &DeletePostCouple{
		repository: repository,
	}
}

func (d *DeletePostCouple) Execute(id int64) error {
	return d.repository.DeletePostCouple(id)
}

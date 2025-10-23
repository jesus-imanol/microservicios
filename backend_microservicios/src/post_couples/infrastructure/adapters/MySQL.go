package adapters

import (
	"backend_microservicios/src/core"
	"backend_microservicios/src/post_couples/domain/entities"
	"encoding/json"
	"fmt"
	"log"
	"time"
)

type MySQL struct {
	conn *core.Conn_MySQL
}

func NewMySQL() (*MySQL, error) {
	conn := core.GetDBPool()
	if conn.Err != "" {
		log.Fatalf("Error al configurar el pool de conexiones: %v", conn.Err)
	}
	return &MySQL{conn: conn}, nil
}

func (mysql *MySQL) CreatePostCouples(postCouple *entities.PostCouple) error {
	query := `INSERT INTO post_couple (titulo, contenido, nombre_anonimo, fecha_publicacion, categoria, etiquetas, num_me_gusta) VALUES (?, ?, ?, ?, ?, ?, ?)`

	// Convertir el slice de etiquetas a JSON para MySQL
	etiquetasJSON, err := json.Marshal(postCouple.Etiquetas)
	if err != nil {
		fmt.Println("Error al serializar etiquetas:", err)
		return err
	}

	result, err := mysql.conn.ExecutePreparedQuery(query, postCouple.Titulo, postCouple.Contenido, postCouple.NombreAnonimo, postCouple.FechaPublicacion, postCouple.Categoria, string(etiquetasJSON), postCouple.NumMeGusta)

	if err != nil {
		fmt.Println(err)
		return err
	}

	if result != nil {
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 1 {
			log.Printf("[MySQL] - Filas afectadas: %d", rowsAffected)
			lastInsertID, err := result.LastInsertId()
			if err != nil {
				fmt.Println(err)
				return err
			}
			postCouple.IDPost = int64(lastInsertID)
		} else {
			log.Printf("[MySQL] - Ninguna fila fue afectada.")
		}
	} else {
		log.Printf("[MySQL] - Resultado de la consulta es nil.")
	}
	return nil
}

func (mysql *MySQL) GetAllPostCouples() ([]*entities.PostCouple, error) {
	query := `SELECT id_post, titulo, contenido, nombre_anonimo, fecha_publicacion, categoria, etiquetas, num_me_gusta FROM post_couple ORDER BY fecha_publicacion DESC`

	rows, err := mysql.conn.FetchRows(query)
	if err != nil {
		fmt.Println("Error al ejecutar la consulta:", err)
		return nil, err
	}
	defer rows.Close()

	var posts []*entities.PostCouple
	for rows.Next() {
		var post entities.PostCouple
		var etiquetasJSON string
		var fechaStr []byte // MySQL devuelve la fecha como []byte

		err := rows.Scan(&post.IDPost, &post.Titulo, &post.Contenido, &post.NombreAnonimo, &fechaStr, &post.Categoria, &etiquetasJSON, &post.NumMeGusta)
		if err != nil {
			fmt.Println("Error al escanear fila:", err)
			return nil, err
		}

		// Parsear la fecha desde string
		post.FechaPublicacion, err = time.Parse("2006-01-02 15:04:05", string(fechaStr))
		if err != nil {
			fmt.Println("Error al parsear fecha:", err)
			return nil, err
		}

		// Deserializar las etiquetas de JSON a slice
		if err := json.Unmarshal([]byte(etiquetasJSON), &post.Etiquetas); err != nil {
			fmt.Println("Error al deserializar etiquetas:", err)
			return nil, err
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error en rows:", err)
		return nil, err
	}

	return posts, nil
}

func (mysql *MySQL) GetPostCouplesByTag(tag string) ([]*entities.PostCouple, error) {
	query := `SELECT id_post, titulo, contenido, nombre_anonimo, fecha_publicacion, categoria, etiquetas, num_me_gusta 
	          FROM post_couple 
	          WHERE JSON_CONTAINS(etiquetas, JSON_QUOTE(?))
	          ORDER BY fecha_publicacion DESC`

	rows, err := mysql.conn.FetchRows(query, tag)
	if err != nil {
		fmt.Println("Error al ejecutar la consulta:", err)
		return nil, err
	}
	defer rows.Close()

	var posts []*entities.PostCouple
	for rows.Next() {
		var post entities.PostCouple
		var etiquetasJSON string
		var fechaStr []byte // MySQL devuelve la fecha como []byte

		err := rows.Scan(&post.IDPost, &post.Titulo, &post.Contenido, &post.NombreAnonimo, &fechaStr, &post.Categoria, &etiquetasJSON, &post.NumMeGusta)
		if err != nil {
			fmt.Println("Error al escanear fila:", err)
			return nil, err
		}

		// Parsear la fecha desde string
		post.FechaPublicacion, err = time.Parse("2006-01-02 15:04:05", string(fechaStr))
		if err != nil {
			fmt.Println("Error al parsear fecha:", err)
			return nil, err
		}

		// Deserializar las etiquetas de JSON a slice
		if err := json.Unmarshal([]byte(etiquetasJSON), &post.Etiquetas); err != nil {
			fmt.Println("Error al deserializar etiquetas:", err)
			return nil, err
		}

		posts = append(posts, &post)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error en rows:", err)
		return nil, err
	}

	return posts, nil
}

func (mysql *MySQL) UpdatePostCouple(postCouple *entities.PostCouple) error {
	query := `UPDATE post_couple 
	          SET titulo = ?, contenido = ?, categoria = ?, etiquetas = ? 
	          WHERE id_post = ?`

	// Convertir el slice de etiquetas a JSON para MySQL
	etiquetasJSON, err := json.Marshal(postCouple.Etiquetas)
	if err != nil {
		fmt.Println("Error al serializar etiquetas:", err)
		return err
	}

	result, err := mysql.conn.ExecutePreparedQuery(query, postCouple.Titulo, postCouple.Contenido, postCouple.Categoria, string(etiquetasJSON), postCouple.IDPost)
	if err != nil {
		fmt.Println("Error al actualizar:", err)
		return err
	}

	if result != nil {
		rowsAffected, _ := result.RowsAffected()
		log.Printf("[MySQL] - Filas actualizadas: %d", rowsAffected)
	}

	return nil
}

func (mysql *MySQL) DeletePostCouple(id int64) error {
	query := `DELETE FROM post_couple WHERE id_post = ?`

	result, err := mysql.conn.ExecutePreparedQuery(query, id)
	if err != nil {
		fmt.Println("Error al eliminar:", err)
		return err
	}

	if result != nil {
		rowsAffected, _ := result.RowsAffected()
		log.Printf("[MySQL] - Filas eliminadas: %d", rowsAffected)
	}

	return nil
}

func (mysql *MySQL) IncrementLikes(id int64) error {
	query := `UPDATE post_couple SET num_me_gusta = num_me_gusta + 1 WHERE id_post = ?`

	log.Printf("[MySQL] - Incrementando me gusta para post ID: %d", id)

	result, err := mysql.conn.ExecutePreparedQuery(query, id)
	if err != nil {
		fmt.Println("Error al incrementar me gusta:", err)
		log.Printf("[MySQL] - Error al incrementar: %v", err)
		return err
	}

	if result != nil {
		rowsAffected, _ := result.RowsAffected()
		log.Printf("[MySQL] - Filas actualizadas (me gusta): %d para ID: %d", rowsAffected, id)
		if rowsAffected == 0 {
			log.Printf("[MySQL] - ADVERTENCIA: No se encontró el post con ID: %d", id)
		}
	} else {
		log.Printf("[MySQL] - ADVERTENCIA: result es nil")
	}

	return nil
}

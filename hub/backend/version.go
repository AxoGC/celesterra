package main

import (
	"encoding/json"
	"errors"

	"gorm.io/gorm"
)

func GetVersion(c *Context) {

	data, err := gorm.G[json.RawMessage](c.DB).Table("versions v").Where(
		"user_id = ? AND datapack_id = ? AND id = ?", c.Param("user_id"), c.Param("datapack_id"), c.Param("id"),
	).Select("data").Take(c)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.AbortWithStatus(404)
		return
	} else if err != nil {
		c.AbortWithStatus(500)
	}

	c.AbortWithStatusJSON(200, data)
}

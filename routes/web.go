package routes

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	"github.com/goravel/framework/support"
)

func Web() {
	facades.Route().Get("/", func(ctx http.Context) http.Response {
		return ctx.Response().View().Make("welcome.tmpl", map[string]any{
			"version": support.Version,
		})
	})
	facades.Route().Get("/stream-video", func(ctx http.Context) http.Response {
		return ctx.Response().View().Make("stream.tmpl")
	})

    facades.Route().Get("/financas", func(ctx http.Context) http.Response {
        return ctx.Response().View().Make("financas.tmpl")
    })
}

package routes

import (
	"goravel/app/http/controllers"
	"goravel/app/http/middleware"

	"github.com/goravel/framework/facades"
	"github.com/goravel/framework/contracts/http"
)

func Web() {
    financasController := controllers.NewFinancasController()
    facades.Route().Fallback(func (ctx http.Context) http.Response {
        return ctx.Response().Redirect(http.StatusSeeOther, "/")
    })
    facades.Route()/*.Middleware(middleware.CreateCsrfTokenMiddleware())*/.Get("/", financasController.Index)
    facades.Route().Middleware(middleware.ValidateCsrfTokenMiddleware()).Post("v2/simular-jc", financasController.CalcularV2)
}

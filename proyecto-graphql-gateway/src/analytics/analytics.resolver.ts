import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductosRestService } from '../productos/productos-rest.service';
import { VentasRestService } from '../ventas/ventas-rest.service';
import { EstadisticasVentasType } from '../types/estadisticas.type';
@Resolver()
export class AnalyticsResolver {
 constructor(
 private productosService: ProductosRestService,
 private ventasService: VentasRestService,
 ) {}
 @Query(() => EstadisticasVentasType)
 async estadisticasVentasMensuales(
 @Args('mes', { type: () => Int }) mes: number,
 @Args('anio', { type: () => Int }) anio: number,
 ) {
 // Obtener todas las ventas del mes
 const ventas = await this.ventasService.findByPeriodo(mes, anio);

 // Calcular estadísticas
 const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
 const promedioVentaDiaria = totalVentas / 30;
 const ventaMaxima = Math.max(...ventas.map(v => v.total));
 const ventaMinima = Math.min(...ventas.map(v => v.total));

 // Obtener mes anterior para comparación
 const mesAnterior = mes === 1 ? 12 : mes - 1;
 const anioAnterior = mes === 1 ? anio - 1 : anio;
 const ventasAnterior = await this.ventasService.findByPeriodo(
 mesAnterior,
 anioAnterior
 );
 const totalAnterior = ventasAnterior.reduce((sum, v) => sum + v.total, 0);
 const variacionPorcentual = ((totalVentas - totalAnterior) / totalAnterior) * 100;

 return {
 mes,
 anio,
 totalVentas,
 numeroVentas: ventas.length,
 promedioVentaDiaria,
 ventaMaxima,
 ventaMinima,
 variacionPorcentual,
 };
 }
}
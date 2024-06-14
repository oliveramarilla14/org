# Fast Tournament

## on work

definir formato de errores
res.status(500).json({
message: error.message
});

## todo

- pensar estructura para fixtures

## done

hacer generador de fixtures y corregir
ya se creo los emparejamientos, ahora crear la parte de logica para los horarios

- crear seeders
  usar modelo de config para crear las configuraciones, al cargar la app que haga un fetch y que luego solo se guarde en una variable que se exporte asi evitar hacer peticiones en exceso
  implementar validaciones en controlador de payment,player y club
  payment router
  trabajar en modulo de multas, parecido a cuotas, queda pay cuota y cancel pay
  configurar configuraciones para trabajar con la base de datos
  crear modelo de config
  editar las amonestaciones
  validacion en amonestaciones
  logica de pago de amonestaciones

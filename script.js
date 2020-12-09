let canvas;
let ctx;

const canvasWidth = document.body.offsetWidth < 500 ? document.body.offsetWidth : 500;
const canvasHeight = 200;
const fireWidth = Math.floor( canvasWidth / 4);
const fireHeight = Math.floor( canvasHeight / 4);
let firePixelArray = [];
let firesource = 36;
//Paleta de cores do fogo
const fireColorPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];


function start(){
    canvas = document.getElementById('fireCanvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx = canvas.getContext("2d");
    ctx.fillRect(0,0,fireWidth, fireHeight);

    createFireDataStructure();
    createFireSource();
    renderFire();

    requestAnimationFrame(calculateFirePropagation);
}

//Cria a estrutura base com o valor de fogo 0
function createFireDataStructure(){
    firePixelArray = [];
    //Fire Lines
    for( let fl = 0; fl < fireHeight; fl++ ){
        let linha = [];
        //Fire Collums
        for(let fc = 0; fc < fireWidth; fc++){
            linha.push(0);
        }
        firePixelArray.push(linha);
    }
}

function calculateFirePropagation(){
    //Fire Collums
    for(let fc = 0; fc < fireWidth; fc++){
        //Fire Lines
        for( let fl = 0; fl < fireHeight; fl++ ){
            calculateFireIntensityPerPixel(fl, fc);
        }
    }

    renderFire();
}

function calculateFireIntensityPerPixel(pl, pc){
    //Retorna caso seja a ultima linha
    if( pl >= fireHeight -1 || pc >= fireWidth){
        return;
    }

    //Decaimento do fogo
    const decay = Math.floor( Math.random() * 3);
    
    //Novo valor de intensidade
    const newFireIntensity = firePixelArray[pl+1][pc] - decay >= 0  ? firePixelArray[pl+1][pc] - decay : 0 ;

    //Efeito vento
    //Desloca o novo valor para a coluna ao lado
    if( pc - decay >= 0 )
        firePixelArray[pl][pc - decay] = newFireIntensity; //Caso a coluna ao lado exista
    else if( pl - 1 >= 0 )
        firePixelArray[pl-1][fireWidth+pc-decay] = newFireIntensity; //Caso a coluna ao lado nao exista, desloca para a linha acima
    else
        firePixelArray[pl][pc] = newFireIntensity; //caso nao exista coluna ao lado e nem linha acima, troca o valor da posicao atual

}

//Renderiza o fogo no canvas
function renderFire(){
    //Render lines
    for( let fl = 0; fl < firePixelArray.length; fl++ ){
        //Render collums
        for(let fc = 0; fc < firePixelArray[fl].length; fc++){
            
            const color = fireColorPalette[ firePixelArray[fl][fc] ];
            const colorString = `${color.r}, ${color.g}, ${color.b}`;
            
            ctx.fillStyle = ` rgb(${colorString})`;

            ctx.fillRect(fc*4, fl*4, 4, 4);
        }
    }

    requestAnimationFrame(calculateFirePropagation);
}

//Cria a fonte do fogo
function createFireSource(){
    for(let fc = 0; fc < fireWidth; fc++){
        firePixelArray[fireHeight-1][fc] = firesource;
    }
}

//Diminui a fonte do fogo
function decreaseFireSource(){
    firesource = firesource - 1 >= 0 ? firesource - 1 : 0;
    createFireSource();
}

//Aumenta a fonte do fogo
function increaseFireSource(){
    firesource = firesource + 1 <= 36 ? firesource + 1 : 36;
    createFireSource();
}

//Destroi a fonte do fogo
function destroyFireSource(){
    firesource = 0;
    createFireSource();
}

//Coloca a fonte do fogo no máximo
function createFullFireSource(){
    firesource = 36;
    createFireSource();
}

//Inicia o fogo
start();
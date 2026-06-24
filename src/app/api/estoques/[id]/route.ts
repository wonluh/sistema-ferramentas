import { NextResponse } from "next/server";
import { Estoque } from "@/classes/Estoque";
import { buscarEstoquePorId, editarEstoque, excluirEstoque } from "@/data/estoqueData";

type Params = {
    params: Promise<{
        id: string;
    }>;  
};

export async function GET(resquest: Request,{params}: Params){
    const {id} = await params;
    const idEstoque = Number(id);

    if(isNaN(idEstoque)){
        return NextResponse.json(
            {erro: "ID inválido."},
            {status: 400 }
        );
    };

    const estoque = await buscarEstoquePorId(idEstoque);

    if(!estoque){
        return NextResponse.json(
            {erro: "Estoque não encontrado."},
            {status: 404}
        );
    };

    return NextResponse.json(
        estoque,
        {status: 200}
    );
}

export async function PUT(request: Request,{params}: Params){
    const {id} = await params;
    const idEstoque = Number(id);
    const body = await request.json();

    if(isNaN(idEstoque)){
        return NextResponse.json(
            {erro: "ID inválido."},
            {status: 400 }
        );
    };

    const estoque = new Estoque(
        idEstoque,
        Number(body.id_ferramenta),
        Number(body.quantidade),
        Number(body.quantidade_minima),
        body.localizacao
    );

    const erro = estoque.validar();

    if(erro){
        return NextResponse.json(
            { erro: erro },
            { status: 400 }
        );
    };

    const resultado = await editarEstoque(idEstoque, estoque);
    
        if(!resultado){
            return NextResponse.json(
                { erro: "Estoque não encontrada." },
                { status: 404}
            );
        }
    
        return NextResponse.json(
            { mensagem: "Estoque atualizado com sucesso."},
            { status: 200 }
        );
}

export async function DELETE(request: Request,{params}: Params){
    const {id} = await params;
    const idEstoque = Number(id);

    if(isNaN(idEstoque)){
        return NextResponse.json(
            { erro: "ID inválido." },
            { status: 400 }
        );
    };

    const resultado = await excluirEstoque(idEstoque);

    if(!resultado){
            return NextResponse.json(
                { erro: "Estoque não encontrada." },
                { status: 404}
            );
        }
    
        return NextResponse.json(
            { mensagem: "Estoque excluido com sucesso."},
            { status: 200 }
        );

}
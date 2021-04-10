// JavaScript Document
class Node {
    id;
    value;
    parent;
    type;
    down;
    right;
    weight;

    constructor(id, value, weight) {
        this.id = id;
        this.value = value;
        this.parent = null;
        this.type = null;
        this.down = null;
        this.right = null;
        this.weight = weight;
    }
}

class Tree {
    head;
    nodeCounter;
    tableData;
    lineCounter;
    wordsList;
    shortNode;
    longNode;

    constructor() {
        this.head = null;
        this.nodeCounter = 0;

        this.tableData = [[]];
        this.lineCounter = 0;
        this.shortNode = null;
        this.longNode = null;
        //this.treeToMatrix(this.head);
        //this.completeMatrix();
    }

    //ADD NODE
    findId(head, id) {
        if (head !== null) {
            var downSearch = this.findId(head.down, id);
            var rightSearch = this.findId(head.right, id);

            if (parseInt(id) === head.id) {
                return head;
            } else if (downSearch !== false) {
                return downSearch;
            } else if (rightSearch !== false) {
                return rightSearch;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addNode(parentId, value, weight) {

        if (parentId === "root") {
            if (this.head == null) {
                this.nodeCounter++;
                let newNode = new Node(this.nodeCounter, value, weight);
                this.head = newNode;
                return true;
            } else {
                alert("El nodo ya esta ocupado.");
                return false;
            }

        } else {
            let parentNode = this.findId(this.head, parentId);
            this.nodeCounter++;
            let newNode = new Node(this.nodeCounter, value, weight);

            if (parentNode.down == null) {
                newNode.parent = parentNode;
                newNode.type = 'down';
                parentNode.down = newNode;
            } else {
                let temp = parentNode.down;
                while (temp.right != null) {
                    temp = temp.right;
                }

                newNode.parent = temp;
                newNode.type = 'right';
                temp.right = newNode;
            }
            return true;
        }
    }

    //ROUTES
    shortRoute(head) {
        if (head.down == null) {

            return [head, head.weight];
        } else {

            let node = head.down;
            let sum = 1000000000;
            let finalNode = null;

            do {

                let resDown = this.shortRoute(node);
                if (resDown[1] < sum) {
                    sum = resDown[1];
                    finalNode = resDown[0];
                }

                node = node.right;
            } while (node != null);
            return [finalNode, parseInt(sum) + parseInt(head.weight)];

        }
    }

    longRoute(head) {
        if (head.down == null) {

            return [head, head.weight];
        } else {

            let node = head.down;
            let sum = 0;
            let finalNode = null;

            do {

                let resDown = this.longRoute(node);
                if (resDown[1] > sum) {
                    sum = resDown[1];
                    finalNode = resDown[0];
                }

                node = node.right;
            } while (node != null);
            return [finalNode, parseInt(sum) + parseInt(head.weight)];

        }
    }

    //CREATE HTML BINARY
    toHTML(head) {
        var html = "";

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            html = '<li>' +
                '<div class="node badge badge-pill badge-' + (head.id == this.shortNode[0].id ? 'success' : head.id == this.longNode[0].id ? 'danger' : 'primary') + '" ><small>' + head.weight + '</small><br>' +
                head.value +
                '</div>';

            if (!(head.down === null && head.right === null)) {

                html += '<ul>' +
                    this.toHTML(head.down) +
                    this.toHTML(head.right) +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }

    //CREATE HTML ENEARY
    setChar(node, charCounter, dir) {
        let data = {};
        data.value = null;
        while (this.tableData[this.lineCounter].length - 1 < charCounter * 2) {
            this.tableData[this.lineCounter].push(data);
        }

        if (dir == 1) {
            let lineFrom = null;
            for (let i = 1; i < this.lineCounter; i++) {
                while (this.tableData[i].length - 1 < charCounter * 2) {
                    this.tableData[i].push({ data });
                }
                if (this.tableData[i][charCounter * 2].value != null) {
                    lineFrom = i;
                }
            }

            for (let i = lineFrom + 1; i < this.lineCounter; i++) {
                data = {};
                data.value = '--';
                this.tableData[i][charCounter * 2] = data;
            }

        } else if (dir == 0) {

            let data = {};
            data.value = '||';
            this.tableData[this.lineCounter][(charCounter * 2) - 1] = data;
        }

        data = {};
        data.value = node.value;
        data.id = node.id;
        data.parent = node.parent;
        data.weight = node.weight;


        this.tableData[this.lineCounter][charCounter * 2] = data;
    }

    addLine() {
        this.tableData.push([]);
        this.tableData.push([]);

        this.lineCounter++;
        this.lineCounter++;
    }

    treeToMatrix(head, charCounter = 0, dir = null) {

        if (head.value == null) {
            this.tableData.push([]);
        }
        //
        this.setChar(head, charCounter, dir);

        if (head.down != null) {
            this.treeToMatrix(head.down, charCounter + 1, 0);
        }

        if (head.right != null) {
            this.addLine();
            this.treeToMatrix(head.right, charCounter, 1);
        }

    }

    completeMatrix() {
        let counter = 0;

        for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].length > counter) {
                counter = this.tableData[i].length;
            }
        }

        for (let i = 0; i < this.tableData.length; i++) {
            while (this.tableData[i].length < counter) {
                let data = {};
                data.value = null;
                this.tableData[i].push(data);
            }
        }


    }

    setMatrixHTML() {

        this.tableData = [[]];
        this.lineCounter = 0;
        this.shortNode = this.shortRoute(this.head);
        this.longNode = this.longRoute(this.head);
        this.treeToMatrix(this.head);
        this.completeMatrix();
    }

    getMatrixHTML() {
        this.setMatrixHTML();
        let html = '';
        for (let i = 0; i < this.tableData[0].length; i++) {
            html += '<tr>';
            for (let j = 0; j < this.tableData.length; j++) {

                if (this.tableData[j][i].value == '||') {
                    html += '<td class="verticalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value == '--') {
                    html += '<td class="horizontalLine">&nbsp;</td>';
                } else if (this.tableData[j][i].value != null) {
                    html += '<td><div class="node badge badge-pill badge-' + (this.tableData[j][i].id == this.shortNode[0].id ? 'success' : this.tableData[j][i].id == this.longNode[0].id ? 'danger' : 'primary') + '" data-toggle="modal" data-target="#formModal" data-parent="' + this.tableData[j][i].id + '" data-parent-value="' + this.tableData[j][i].value + '">' +
                        '<small>' + this.tableData[j][i].weight + '</small><br>' +
                        this.tableData[j][i].value +
                        '</div></td>';
                } else {
                    html += '<td class="empty">&nbsp;</td>';
                }

            }
            html += '</tr>';
        }

        return html;
    }

}

var tree = new Tree();

function addNode() {


    if ($('#valueTxt').val().length > 0 && ($('#weightTxt').val() || tree.head === null)) {
        tree.addNode($('#parentTxt').val(), $('#valueTxt').val(), $('#weightTxt').val())
        $('#formModal').modal('hide');
        printTrees();
    } else {
        alert('Ingrese valor y costo');
    }

}

function printTrees() {
    if (tree.head === null) {//si aun no hay raiz
        $('#addRootA').show();//mostrar boton de insertar raiz
        //$('#ulTreeA').html("Árbol vacío");
        //$('#ulTreeB').html("Árbol vacío");
    } else {
        $('#addRootA').hide();//ocultar boton de insertar raiz
        $('#ulTreeA').html(tree.getMatrixHTML());
        $('#ulTreeB').html(tree.toHTML(tree.head));//imprimir arbol

        let shortRoute = tree.shortRoute(tree.head);
        console.log(shortRoute);
        $('#shortValue').html(shortRoute[0].value);
        $('#shortWeight').html(shortRoute[1]);

        let longRoute = tree.longRoute(tree.head);
        console.log(shortRoute);
        $('#longValue').html(longRoute[0].value);
        $('#longWeight').html(longRoute[1]);
    }

}

tree.addNode('root', 'a', 0);
printTrees();//imprimir arboles

$('#formModal').on('show.bs.modal', function (event) {//listener botones
    var button = $(event.relatedTarget); // Boton q inicia el div modal
    var parent = button.data('parent'); // Extrae la info del atributo data-parent 
    var parentValue = button.data('parent-value'); // Extrae la info del atributo data-parent-value 
    var modal = $(this);

    modal.find('#valueTxt').val("");
    modal.find('#weightTxt').val("");

    if (parentValue == 'root') {
        modal.find('#weightTxt').val("0");
    }

    modal.find('.modal-title').text('Nuevo nodo en ' + parentValue + ' en el árbol.');
    modal.find('#parentTxt').val(parent);//llenar el campo parent oculto en el form 
});

/*
    JISON COMPILER
*/

%{
    // Importations
    import { type, arithmeticOperator, relationalOperator } from "./tools/Type.js";
    import { Arithmetic } from './expression/Arithmetic.js';
    import { Relational } from './expression/Relational.js';
    import Primitive from './expression/Primitive.js';
    import { Identifier } from './expression/Identifier.js';
    import { Print } from './instructions/Print.js';
    import { Declaration } from './instructions/Declaration.js';
    import { If } from './instructions/If.js';

%}

%{
    // Variables definition and functions

    let errors = [];

    const clean_errors = () => {
        errors = [];
    }
%}

/*------------------------ Lexical Definition ------------------------*/

%lex 
%options case-insensitive

%%

\s+                         // Spaces Ignored
"//".*                      // Comment inline

/*------------------------ Reserved Words ------------------------*/

"int"                       return "res_int";
"boolean"                   return "res_boolean";
"string"                    return "res_string";

"if"                        return "res_if";
"else"                      return "res_else";
"print"                     return "res_print";

"true"                      return "res_true";
"false"                     return "res_false";


/*------------------------ Tokens ------------------------*/

"("                         return "tk_par_left";
")"                         return "tk_par_right";
"{"                         return "tk_bra_left";
"}"                         return "tk_bra_right";
";"                         return "tk_semicolon";

"+"                         return "tk_plus";
"-"                         return "tk_minus";
"*"                         return "tk_mult";
"/"                         return "tk_div";

"=="                        return "tk_eq";
"!="                        return "tk_neq";
"<="                        return "tk_lte";
">="                        return "tk_gte";
"<"                         return "tk_lt";
">"                         return "tk_gt";

"="                         return "tk_assign";

[ \r\t]+                    {}
\n                          {}

\"[^\"]*\"                  { yytext = yytext.substr(1, yyleng-2); return 'STRING'; }

[0-9]+\b                    return 'INTEGER';
[a-zA-Z][a-zA-Z0-9]*        return 'IDENTIFIER';

<<EOF>>                     return 'EOF';

.                           { console.log(`Lexical error ${yytext} in [${yylloc.first_line}, ${yylloc.first_column}]`); }

/lex

/*------------------------ Operators Precedence ------------------------*/

%nonassoc 'tk_eq' 'tk_neq' 'tk_lt' 'tk_lte' 'tk_gt' 'tk_gte'
%left 'tk_plus' 'tk_minus'
%left 'tk_mult' 'tk_div'


/*------------------------ Grammar Definition ------------------------*/

%start ini

%%

    ini : instructions EOF                                              { return $1; }
    ;

    instructions : instructions instruction                             { $1.push($2); $$ = $1; }
                 | instruction                                          { $$ = $1 === null ? [] : [$1]; }
    ;

    instruction : declaration tk_semicolon                              { $$ = $1; }
                | print tk_semicolon                                    { $$ = $1; }
                | if                                                    { $$ = $1; }
                | error tk_semicolon                                    { errors.push(`Sintactic error ${yytext} in [${this._$.first_line}, ${this._$.first_column}]`); $$ = null; }
    ;

    declaration : type IDENTIFIER tk_assign expression                  { $$ = new Declaration($1, $2, $4, @1.first_line, @1.first_column); }
    ;

    print : res_print tk_par_left expression tk_par_right               { $$ = new Print($3, @1.first_line, @1.first_column); }
    ;

    if : res_if tk_par_left expression tk_par_right tk_bra_left instructions tk_bra_right                                                                           { $$ = new If($3, $6, undefined, undefined, @1.first_line, @1.first_column); }
       | res_if tk_par_left expression tk_par_right tk_bra_left instructions tk_bra_right res_else tk_bra_left instructions tk_bra_right                            { $$ = new If($3, $6, $10, undefined, @1.first_line, @1.first_column); }
       | res_if tk_par_left expression tk_par_right tk_bra_left instructions tk_bra_right res_else if                                                               { $$ = new If($3, $6, undefined, $9, @1.first_line, @1.first_column); }
    ;

    type : res_int                                                      { $$ = type.INT; }
         | res_boolean                                                  { $$ = type.BOOLEAN; }
         | res_string                                                   { $$ = type.STRING; }
    ;

    expression : expression tk_plus expression                          { $$ = new Arithmetic($1, $3, arithmeticOperator.PLUS, @1.first_line, @1.first_column); }
               | expression tk_minus expression                         { $$ = new Arithmetic($1, $3, arithmeticOperator.MINUS, @1.first_line, @1.first_column); }
               | expression tk_mult expression                          { $$ = new Arithmetic($1, $3, arithmeticOperator.MULT, @1.first_line, @1.first_column); }
               | expression tk_div expression                           { $$ = new Arithmetic($1, $3, arithmeticOperator.DIV, @1.first_line, @1.first_column); }
               | expression tk_eq expression                            { $$ = new Relational($1, $3, relationalOperator.EQ, @1.first_line, @1.first_column); }
               | expression tk_neq expression                           { $$ = new Relational($1, $3, relationalOperator.NEQ, @1.first_line, @1.first_column); }
               | expression tk_lte expression                           { $$ = new Relational($1, $3, relationalOperator.LTE, @1.first_line, @1.first_column); }
               | expression tk_gte expression                           { $$ = new Relational($1, $3, relationalOperator.GTE, @1.first_line, @1.first_column); }
               | expression tk_lt expression                            { $$ = new Relational($1, $3, relationalOperator.LT, @1.first_line, @1.first_column); }
               | expression tk_gt expression                            { $$ = new Relational($1, $3, relationalOperator.GT, @1.first_line, @1.first_column); }
               | IDENTIFIER                                             { $$ = new Identifier($1, @1.first_line, @1.first_column); }
               | STRING                                                 { $$ = new Primitive($1, type.STRING, @1.first_line, @1.first_column); }
               | INTEGER                                                { $$ = new Primitive($1, type.INT, @1.first_line, @1.first_column); }
               | boolean                                                { $$ = new Primitive($1, type.BOOLEAN, @1.first_line, @1.first_column); }
               | tk_par_left expression tk_par_right                    { $$ = $2; }
    ;

    boolean : res_true      { $$ = $1; }
            | res_false     { $$ = $1; }
    ;

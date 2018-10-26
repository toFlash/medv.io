---
title: "How to write your own expression engine?"
date: 2018-09-28
---

I'm a backend developer at Aviasales, the largest airline search engine in Russia.

Initially, our search engine was written in Python, we had an excellent architecture (something like an advanced middleware) that we transfer to Go with almost no changes. We call it chains, the chain can be sequential (just as normal middlewares), it can be parallel, or can be detached. Chains consist of units, individual independent units. Each unit can be called separately. One of the consequences of this architecture is that we can call units written in Python from our new search engine in Go.

One of the units that we needed to transfer to Go was Ruler. Ruler is a unit that accepts a large number of incoming parameters and decides whether to continue the execution of the chain or stop. With so many parameters and fast changing conditions, it's impossible to implement all the rules in the code (in Python this was solved with eval function, but in Go there is no eval funcation) so we decided to write an expression engine where the rules could be described in the application configuration and be changed without recompiling the program and replaced on the fly.


Today I will tell you how to write your own expression engine.

Let's start with the theory. As probably everyone knows most of the programming languages consist of Lexer, Parser and Compiler. But since we are writing the expression engine instead of the Compiler, we will have an Evaler.

Lexer reads the original string and produces tokens, the parser receives tokens and produces an abstract syntax tree, Evaler executes this tree with a specified context.

Let's start with Lexer.

There are many ways to write a lexer, the two most common ones are using bunch of regular expressions, or using a state machine. We will use a state machine.

Lexer reads the input string character by character and produces tokens made of two elements: the type of the token and a value. For expression engine, we need only a few types of tokens:
Name - to designate variables,
Number - for numbers,
Text is for strings,
Operator for operators,
Punctuation and special token end of file

To describe the state of our state machine, we will use a special function that takes a lexer and returns the next state function.

The lexer itself will store an input string, a position in input string, and a list of produced tokens.

The lex function will store the state of the state machine in a loop, starting with the special state lexRoot, until nil is received, informing about the completion of the lexer operation, after which we can return the list of produced tokens.

lexRoot get the next character from the input string and decides which state to "go" to our state machine. For example, if the quote character is encountered, go to the lexQuote state.

lexQuote absorbs all characters until the next quote is encountered and produces a token with a text type and a value collected between two quotes (the code to skip the escaped quotes is omitted). After state can go back to the lexRoot state.

After the lex step is finished, we get a list of tokens and their values.
To write a parser we need a context-free grammar, of course there are many parser generators (such as goyacc and others), but I want to show how you can write your own parser from scratch. I'll tell you how to write a simple LL (1) recursive descent parser.

First of all, what is context-free grammar?
It is:
A set of terminal symbols (tokens). 
A set of nonterminals (syntactic variables). 
A set of productions, where each production consists of a nonterminal, called the head or left side of the production, an arrow, and a sequence of terminals and/or nonterminals, called the body or right side of the production. 
A designation of one of the nonterminals as the start symbol.

Let’s take a look at a simple grammar: it consists of one nonterminal S; three terminals: plus, one, and a; three production rules; and the starting symbol S.

For example, to get given input line from this grammar we start with the starting symbol S and use the first production as a simple replacement rule, replace S by S + S. Next, replace the first occurrence of S by 1 according to the second production rule and so on until we get the original string. Thus, proving that this line belongs to the language described by this grammar. This process is called derivation.

Choosing each time a leftmost nonterminal, we got a such parse tree, but if we would choose a rightmost nonterminal each time, we would get another parse tree,

It is important to know whether the parser determines a leftmost or a rightmost derivation because this determines the order in which the pieces of code will be executed.

For example, in the following grammar, we can get two parse trees, but only the right parse tree is valid, since we know what the order of the operators is.

If a string in the language of the grammar has more than one parsing tree, then the grammar is said to be an ambiguous grammar.

We can fix the situation by entering the following corrections into the grammar. We added an additional nonterminal and implicitly encourage correct priorities of operators.

Let’s now turn this grammar into code, Each production rule transforms into a function and each nonterminal in the body of productions is represented as a call to the corresponding function. However, we immediately encounter a problem: the second production rule calls itself and our program gets stuck. This is called left recursive production. However, we can again slightly modify our grammar.

I combined production rules with the same heads with a vertical bar for short.

The left recursion can be eliminated by rewriting incorrect production rules. Here, the hof terminals and nonterminals that do not start with A.
By introducing an additional nonterminal R, we converted the production rules to the right recursive, since now the R call is right most.

Now consider a more complex grammar containing the operations of addition and multiplication. This grammar contains left recursive production rules. Applying the transformation rule, we can rewrite them all into left-recursive ones.

Now we can rewrite the grammar into code, since now the choice of production isg at the beginning of each recursive production.

Let's define the nodes of our abstract syntax tree. And for simplicity our AST will consist only  from one node - binaryNode. For simplicity, we also replace token structs with strings.

We introduce helper functions Next and Match.
Next returns the next character from the list of tokens,
And Match check a current terminal called lookahead with given terminal, if it matches, moves the lookahead to the next terminal.

Further, simply rewriting the production rules as they are, recursive products begin with the terminal by which we can choose what productions to use, empty productions (empty else) are omitted here.

In atom production rule, we check that the current token fits our definition of atom and add it to the special stack, which contains all the atoms in the Reverse Polish Notation, and in the emit function gets the last two elements from the stack, creates a binaryNode and puts it back on the stack this is called Postfix algorithm)

Now we can call our start symbol and if everything went well and we did not catch any panic then on top of the stack will be our abstract syntactic tree.

A full example of the parser can be found by this link. Let's try to run and test our parser, as you see it is left-recursive, it correctly parses the priority of operators and understands the parentheses.

Now to Evaler. To execute our AST we will extend node interface and add an eval() method.

Here is an example of implementing the eval() method for binaryNode, eval the left and right parts. Then perform an action, depending on the operator. Keep in mind, that in order it to work, we need to write additional AST nodes for constants and variables.

Let's try to run our calculator and check the results. All right?

I wrote my expression engine which we use in Aviasales. It understands all of these expressions, and he's written like I just told.

Has user-friendly errors and type checks.

Here is an example of a parser error for invalid code. It’s convenient, so we can check what a rule is written correctly at the stage of saving config. Expr also uses reflection, so we do not need to define types separately, but can use those that are already in our Go code.

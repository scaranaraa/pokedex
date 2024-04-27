(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"module-constants.html\">constants</a>","id":"module:constants","children":[]},{"label":"<a href=\"module-index.html\">index</a>","id":"module:index","children":[]},{"label":"<a href=\"module-init.html\">init</a>","id":"module:init","children":[]},{"label":"<a href=\"module-models.html\">models</a>","id":"module:models","children":[{"label":"<a href=\"module-models-DataManagerBase.html\">DataManagerBase</a>","id":"module:models~DataManagerBase","children":[]},{"label":"<a href=\"module-models-Evolution.html\">Evolution</a>","id":"module:models~Evolution","children":[]},{"label":"<a href=\"module-models-EvolutionList.html\">EvolutionList</a>","id":"module:models~EvolutionList","children":[]},{"label":"<a href=\"module-models-EvolutionTrigger.html\">EvolutionTrigger</a>","id":"module:models~EvolutionTrigger","children":[]},{"label":"<a href=\"module-models-Item.html\">Item</a>","id":"module:models~Item","children":[]},{"label":"<a href=\"module-models-ItemTrigger.html\">ItemTrigger</a>","id":"module:models~ItemTrigger","children":[]},{"label":"<a href=\"module-models-LevelMethod.html\">LevelMethod</a>","id":"module:models~LevelMethod","children":[]},{"label":"<a href=\"module-models-LevelTrigger.html\">LevelTrigger</a>","id":"module:models~LevelTrigger","children":[]},{"label":"<a href=\"module-models-Move.html\">Move</a>","id":"module:models~Move","children":[]},{"label":"<a href=\"module-models-MoveEffect.html\">MoveEffect</a>","id":"module:models~MoveEffect","children":[]},{"label":"<a href=\"module-models-MoveMeta.html\">MoveMeta</a>","id":"module:models~MoveMeta","children":[]},{"label":"<a href=\"module-models-MoveMethod.html\">MoveMethod</a>","id":"module:models~MoveMethod","children":[]},{"label":"<a href=\"module-models-MoveResult.html\">MoveResult</a>","id":"module:models~MoveResult","children":[]},{"label":"<a href=\"module-models-OtherTrigger.html\">OtherTrigger</a>","id":"module:models~OtherTrigger","children":[]},{"label":"<a href=\"module-models-PokemonMove.html\">PokemonMove</a>","id":"module:models~PokemonMove","children":[]},{"label":"<a href=\"module-models-Species.html\">Species</a>","id":"module:models~Species","children":[]},{"label":"<a href=\"module-models-StatChange.html\">StatChange</a>","id":"module:models~StatChange","children":[]},{"label":"<a href=\"module-models-StatStages.html\">StatStages</a>","id":"module:models~StatStages","children":[]},{"label":"<a href=\"module-models-Stats.html\">Stats</a>","id":"module:models~Stats","children":[]},{"label":"<a href=\"module-models-TradeTrigger.html\">TradeTrigger</a>","id":"module:models~TradeTrigger","children":[]}]},{"label":"<a href=\"module-pokemonbase.html\">pokemonbase</a>","id":"module:pokemonbase","children":[{"label":"<a href=\"module-pokemonbase-PokemonBase.html\">PokemonBase</a>","id":"module:pokemonbase~PokemonBase","children":[]}]},{"label":"<a href=\"module-utils.html\">utils</a>","id":"module:utils","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: false,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);

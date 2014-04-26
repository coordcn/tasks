/** 
  @copyright Copyright (C) 2014 coord.cn All rights reserved. 
  @overview 异步任务
  @author Qianye(hohai_wow@hotmail.com)
 */
 
/**
  @function parallel(tasks, callback) 并行任务执行
  @param tasks {object} 任务
    function task(callback){
      fs.readFile(path, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  @param callback {function} 任务全部完成后执行的回调函数
    function callback(err, results){
      if(err){
        handle(err);
      }else{
        handle(results);
      }
    }
  @example
    parallel({
      test0:test0function,
      test1:test1function
    }, callback);
    
    function test0funtion(callback){
      fs.readFile(path0, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function test1funtion(callback){
      fs.readFile(path1, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function callback(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results.test0);
        console.log(results.test1);
      }
    }
 */
exports.parallel = function(tasks, callback){
  var keys = Object.keys(tasks);
  var len = keys.length;
  
  if(len < 1) return;
  callback = callback || function(){};
  
  var results = {};
  var completed = 0;
  
  keys.forEach(function(key){
    tasks[key](function(err, result){
      if(err){
        callback(err);
        callback = function(){};
      }else{
        completed++;
        results[key] = result;
        if(completed >= len){
          callback(null, results);
        }
      }
    });
  });
};

/**
  @function series(tasks, callback) 顺序任务执行
  @param tasks {object} 任务
    function task(callback, reuslt){
      var path = result;
      fs.readFile(path, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
  @param callback {function} 任务全部完成后执行的回调函数
    function callback(err, result){
      if(err){
        handle(err);
      }else{
        handle(result);
      }
    }
  @example
    series({
      test0:test0function,
      test1:test1function
    }, callback);
    
    function test0funtion(callback, results){
      fs.readFile(path0, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    }
    
    function test1funtion(callback, results){
      var path1 = results.test0;
      fs.readFile(path1, function(err, data){
        if(err){
          callback(err);
        }else{
          callback(null, data);
        }
      });
    };
    
    function callback(err, reuslts){
      if(err){
        console.log(err);;
      }else{
        console.log(results.test0);
        console.log(results.test1);
      }
    }
 */
exports.series = function(tasks, callback){
  var keys = Object.keys(tasks);
  var len = keys.length;
  
  if(len < 1) return;
  callback = callback || function(){};
  
  var results = {};
  var completed = 0;
  
  var iterate = function(){
    var key = keys[completed];
    (function(key){
      tasks[key](function(err, result){
        if(err){
          callback(err);
          callback = function(){};
        }else{
          completed++;
          results[key] = result;
          if(completed >= len){
            callback(null, results);
          }else{
            iterate();
          }
        }
      }, results);
    })(key);
  };
 
  iterate();;
}
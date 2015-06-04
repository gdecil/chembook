function getColor(actval) {
  var x;
  if (actval<0.1)
    {
    x="#FF0000";    //red
    }
  else if (actval<1)
    {
    x="#FF00FF";    //magenta
    }
  else if (actval<10)
    {
    x="00FF00"; //green
    }
  else
    {
    x="000000"; //black
    }
  return x;
};
